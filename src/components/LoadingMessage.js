import {
  CircularProgress
} from "@mui/material"

export default function LoadingMessage(props) {
  
  const {
    isLoading,
    isLoadingError,
    loadingMessage
  } = props;


  let message;
  let attrs = {
    className: "loading-message"
  };
  let loadingSpinner = null;
  
  if (isLoading) {
    attrs.className = "loading-message-loading";
    loadingSpinner = <CircularProgress size={20}/>
    message = loadingMessage;
  } else {
    if (isLoadingError) {
      attrs.className = `${attrs.className} loading-message-failure`;
      message = `${loadingMessage}`;
    } else {
      attrs.className = `${attrs.className} loading-message-success`;
      message = `Successfully retrieved data: ${loadingMessage}`;
    }
  }

  return (
    <div {...attrs}>
      {message}
      {loadingSpinner}
    </div>
  );

}