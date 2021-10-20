# Purpose of the files

### borders.xlsx

Tests border styles and configurations for different combinations of color, width and direction of a border.

### charts.xlsx

Test all chart types: column (2d column, 3d column, 2d bar. 3d bar), line (2d line, 3dline, 2d area, 3d area), statistical (histogram, box and whisker), waterfall (waterfall, funnel, stock, surface, radar), pie (2d pie, 3d pie, doughnut), XY (scatter, bubble), combo, map, sparkline. One tab tests different styles of chart formatting.

### cell-types.xlsx

Various types of cell formatting: text, integer, floating point, currency, date, time, percent.

### empty.xlsx

The simplest, small XLSX file used when you want to load a file quickly.

### functions.xlsx

Tests Excel functions (reference, addition, subtraction, multiplication, division, sum).

### merged-cells.xlsx

Tests "merged cells" behaviour and text inside the cells.

### styling.xlsx

Tests different font formatting (font family, font size, bold text, italic text, underlined text, font color),
alignment and indentation (many levels of indentation, wrapped text), border formats and background formats.

### tabs-a.xlsx

Used to test switching between files with identical tab names.

### tabs-b.xlsx

Used to test switching between files with identical tab names.

### text-alignment.xlsx

Examples of various horizontal and vertical text alignment, combined with text wrapping.

### reload.xlsx

Tests preserving active sheet tab on page reload.

### embeds.xlsx

Contains embedded images, one type per worksheet: gif, svg, jpeg, png.
The png image is single image embedded twice. This creates an edge case of single drawing being embedded twice, thus producing two relations for the same drawing object, inside worksheet.
