import {
  Slide
} from '@mui/material';
export function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}
export default function SnackbarUp(props: {
  open: boolean;
  message: string;
}) {
  return <Snackbar {...props} autoHideDuration={1000} TransitionComponent={TransitionUp} />;
}
