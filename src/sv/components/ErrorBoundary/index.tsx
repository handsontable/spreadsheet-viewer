import { PureComponent } from 'react';

type ErrorBoundaryProps = {
  onError: (error: Error) => void
};

export class ErrorBoundary extends PureComponent<ErrorBoundaryProps> {
  componentDidCatch(error: any) {
    const { onError } = this.props;
    onError(error);
  }

  render() {
    const { children } = this.props;

    return children;
  }
}
