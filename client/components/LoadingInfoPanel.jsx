import React from 'react';
import { Button } from 'react-bootstrap';

const LoadingInfoPanel = ({ loadingState, handleLoadHistory }) => {
  if (loadingState === 'notLoading') return false;
  const loadingSpinner = (
    <div className="d-flex align-items-center ">
      <span className="spinner-border spinner-border-sm mr-2" />
      <span className="h5 m-0">Loading...</span>
    </div>
  );
  const errorMsg = (
    <div className="d-flex align-items-center">
      <p className="m-0 text-danger h6">Error happen while loading messages.</p>
      <div className="ml-2">
        <Button
          block
          variant="warning"
          onClick={handleLoadHistory}
        >
          Try again.
        </Button>
      </div>
    </div>
  );
  let coreElement;
  if (loadingState === 'loading') {
    coreElement = loadingSpinner;
  } else if (loadingState === 'failure') {
    coreElement = errorMsg;
  }
  return (
    <div
      className="position-absolute py-3 px-5 bg-light"
      style={{ left: 0, top: 0, right: 0 }}
    >
      {coreElement}
    </div>
  );
};

export default LoadingInfoPanel;
