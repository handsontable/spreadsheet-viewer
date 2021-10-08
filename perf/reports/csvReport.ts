import fs from 'fs';
import path from 'path';
import { format } from '@fast-csv/format';
import { parse } from '@fast-csv/parse';
import { MarkerTiming, AppMarkersTimings, PerformanceMarker } from '../markers';
import { COLORS } from './consoleReport';
import { PerformanceMeasurementReport } from './report';

export type CSVReportDataItem = [string, [string, MarkerTiming][]];
export type CSVReportData = CSVReportDataItem[];

export interface CSVReport {
  reportPath: string;
  data: PerformanceMeasurementReport[];
  markers: PerformanceMarker[];
}

const SCENARIO_LABEL = 'scenarioName';
const REPORTS_PATH = './perf/reports/generated';

export const writeCSVReport = ({ reportPath, markers, data }: CSVReport): Promise<void> => new Promise(
  (resolve, reject) => {
    const writeStream = fs.createWriteStream(reportPath);
    const csvStream = format({ quote: false });
    csvStream.pipe(writeStream)
      .on('finish', () => {
        console.log(COLORS.green, `\nCSV report was saved as:\n${reportPath}`);

        resolve();
      })
      .on('error', (error) => {
        console.log(COLORS.red, `\nCSV report failed to generate!\n${reportPath}`);
        console.log(error.toString());

        reject();
      });

    csvStream.write([SCENARIO_LABEL, ...markers]);
    data.forEach(({ name, timings }) => {
      timings.forEach((timing) => {
        csvStream.write([name, ...markers.map(marker => timing[marker])]);
      });
    });

    csvStream.end();
  }
);

export const generateCSVReport = async(fileName: string, markers: PerformanceMarker[], measurements: PerformanceMeasurementReport[]) => {
  const reportsFolderPath = path.resolve(REPORTS_PATH);
  const reportPath = path.resolve(`${reportsFolderPath}/${fileName}`);

  await fs.promises.mkdir(reportsFolderPath, { recursive: true });
  await writeCSVReport({
    data: measurements,
    reportPath,
    markers
  });
};

export const readCSVReport = (reportFileName: string): Promise<PerformanceMeasurementReport[]> => new Promise(
  (resolve, reject) => {
    const reportsFolderPath = path.resolve(REPORTS_PATH);
    const reportPath = path.resolve(`${reportsFolderPath}/${reportFileName}`);
    const measurements: PerformanceMeasurementReport[] = [];
    let reportMarkers: PerformanceMarker[] = [];
    let scenarioTimings: AppMarkersTimings[] = [];
    let scenarioName: string | null = null;

    fs.createReadStream(reportPath)
      .pipe(parse())
      .on('data', (data: string[]) => {
        const [name, ...entries] = data;

        if (name !== scenarioName) {
          // If first column of row data equals "scenarioName", it means that this is first row of report,
          // and markers defined in this report, should be taken from first line.
          if (name === SCENARIO_LABEL) {
            reportMarkers = entries as PerformanceMarker[];

            return;
          }
          // If "scenarioName" is defined and it differs from "name" (first column of row data)
          // it means that all data rows of scenario were parsed, and these should be pushed to "measurements".
          if (scenarioName) {
            measurements.push({
              name: scenarioName,
              timings: scenarioTimings,
            });
            scenarioTimings = [];
          }
        }

        scenarioName = name;
        const sampleTimings: AppMarkersTimings = reportMarkers.reduce<AppMarkersTimings>((gatheredTimings, marker, index) => Object.assign(gatheredTimings, {
          [marker]: Number(entries[index])
        }), {});

        scenarioTimings.push(sampleTimings);
      })
      .on('finish', () => {
        if (scenarioName === null) {
          throw new Error('No `scenarioName` found');
        }

        measurements.push({
          name: scenarioName,
          timings: scenarioTimings,
        });
        resolve(measurements);
      })
      .on('error', (error) => {
        console.log(COLORS.red, `CSV report failed to read!\n${reportPath}`);
        console.log(error.toString());

        reject();
      });
  }
);
