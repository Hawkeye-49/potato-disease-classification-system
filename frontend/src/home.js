import { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  Paper,
  CardActionArea,
  CardMedia,
  Grid,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button,
  CircularProgress,
} from "@material-ui/core";
import potato_logo from "./potato_logo.jpg";
import image from "./background.jpg";
import { DropzoneArea } from "material-ui-dropzone";
import { common } from "@material-ui/core/colors";
import Clear from "@material-ui/icons/Clear";

const ColorButton = withStyles((theme) => ({
  root: {
    color: "#fff",
    backgroundColor: "rgba(9,143,38,0.85)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "50px",
    padding: "14px 36px",
    fontSize: "15px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 20px rgba(9,143,38,0.35)",
    "&:hover": {
      backgroundColor: "rgba(9,143,38,1)",
      boxShadow: "0 6px 28px rgba(9,143,38,0.55)",
      transform: "translateY(-1px)",
    },
  },
}))(Button);

const axios = require("axios").default;

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  clearButton: {
    width: "100%",
  },
  root: {
    maxWidth: 345,
    flexGrow: 1,
  },
  media: {
    height: 340,
    objectFit: "cover",
    borderRadius: "20px 20px 0 0",
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: 500,
  },
  gridContainer: {
    justifyContent: "center",
    padding: "5em 1em 2em 1em",
  },
  mainContainer: {
    backgroundImage: `url(${image})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    minHeight: "93vh",
    marginTop: "0px",
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(160deg, rgba(0,40,10,0.55) 0%, rgba(0,0,0,0.3) 100%)",
      zIndex: 0,
    },
  },
  innerGrid: {
    position: "relative",
    zIndex: 1,
  },
  imageCard: {
    margin: "auto",
    maxWidth: 420,
    backgroundColor: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    boxShadow:
      "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.3) !important",
    borderRadius: "24px !important",
    border: "1px solid rgba(255,255,255,0.2)",
    overflow: "hidden",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow:
        "0 16px 56px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3) !important",
    },
  },
  imageCardEmpty: {
    height: "auto",
  },
  noImage: {
    margin: "auto",
    width: 400,
    height: "400 !important",
  },
  input: {
    display: "none",
  },
  uploadIcon: {
    background: "white",
  },
  tableContainer: {
    backgroundColor: "transparent !important",
    boxShadow: "none !important",
  },
  table: {
    backgroundColor: "transparent !important",
  },
  tableHead: {
    backgroundColor: "transparent !important",
  },
  tableRow: {
    backgroundColor: "transparent !important",
  },
  tableCell: {
    fontSize: "22px",
    backgroundColor: "transparent !important",
    borderColor: "rgba(9,143,38,0.15) !important",
    color: "#1a4d2e !important",
    fontWeight: "800",
    padding: "6px 24px 6px 16px",
    fontFamily: "'Georgia', serif",
  },
  tableCell1: {
    fontSize: "11px",
    backgroundColor: "transparent !important",
    borderColor: "transparent !important",
    color: "#4a7c59 !important",
    fontWeight: "700",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    padding: "8px 24px 4px 16px",
  },
  tableBody: {
    backgroundColor: "transparent !important",
  },
  text: {
    color: "white !important",
    textAlign: "center",
  },
  buttonGrid: {
    maxWidth: "420px",
    width: "100%",
  },
  detail: {
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(10px)",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 16px 24px !important",
    borderTop: "1px solid rgba(9,143,38,0.12)",
  },
  appbar: {
    background: "rgba(5, 90, 25, 0.92)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    boxShadow: "0 2px 20px rgba(0,0,0,0.25) !important",
    color: "white",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  appbarTitle: {
    fontWeight: 700,
    letterSpacing: "0.04em",
    fontSize: "1.05rem",
    color: "#d4f5de",
  },
  loader: {
    color: "#038c33 !important",
  },
  loaderWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    padding: "24px 16px",
    background: "rgba(255,255,255,0.92)",
  },
  loaderText: {
    color: "#2d6a4f !important",
    fontWeight: "600 !important",
    letterSpacing: "0.06em",
    fontSize: "0.85rem !important",
    textTransform: "uppercase",
  },
  pageTitle: {
    color: "white",
    textAlign: "center",
    fontFamily: "'Georgia', serif",
    fontWeight: "700",
    fontSize: "2rem",
    marginBottom: "6px",
    textShadow: "0 2px 12px rgba(0,0,0,0.4)",
  },
  pageSubtitle: {
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    fontSize: "0.9rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "28px",
  },
  resultLabel: {
    color: "#2d6a4f",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    marginBottom: "4px",
  },
  confidenceBadge: {
    display: "inline-block",
    background: "linear-gradient(135deg, #098f26, #05601a)",
    color: "white",
    borderRadius: "50px",
    padding: "3px 14px",
    fontSize: "14px",
    fontWeight: 800,
    marginLeft: "8px",
    boxShadow: "0 2px 8px rgba(9,143,38,0.4)",
  },
}));

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  let confidence = 0;

  const sendFile = async () => {
    if (image) {
      let formData = new FormData();
      formData.append("file", selectedFile);
      let res = await axios({
        method: "post",
        url: process.env.REACT_APP_API_URL,
        data: formData,
      });
      if (res.status === 200) {
        setData(res.data);
      }
      setIsloading(false);
    }
  };

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) {
      return;
    }
    setIsloading(true);
    sendFile();
  }, [preview]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImage(true);
  };

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Avatar
            src={potato_logo}
            style={{
              width: 36,
              height: 36,
              marginRight: 12,
              border: "2px solid rgba(255,255,255,0.4)",
            }}
          />
          <Typography className={classes.appbarTitle} variant="h6" noWrap>
            Sistem PCD — Potato Classification Disease
          </Typography>
          <div className={classes.grow} />
        </Toolbar>
      </AppBar>

      <Container
        maxWidth={false}
        className={classes.mainContainer}
        disableGutters={true}
      >
        <Grid
          className={`${classes.gridContainer} ${classes.innerGrid}`}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          {/* Page heading */}
          <Grid item xs={12}>
            <Typography className={classes.pageTitle} variant="h4">
              Deteksi Penyakit Kentang
            </Typography>
            <Typography className={classes.pageSubtitle} variant="body2">
              Unggah foto kentang untuk analisis penyakit
            </Typography>
          </Grid>

          {/* Main card */}
          <Grid item xs={12}>
            <Card
              className={`${classes.imageCard} ${
                !image ? classes.imageCardEmpty : ""
              }`}
            >
              {image && (
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={preview}
                    component="img"
                    title="Uploaded potato"
                  />
                </CardActionArea>
              )}

              {!image && (
                <CardContent className={classes.content}>
                  <DropzoneArea
                    acceptedFiles={["image/*"]}
                    dropzoneText={
                      "Seret & lepas gambar kentang di sini, atau klik untuk memilih"
                    }
                    onChange={onSelectFile}
                  />
                </CardContent>
              )}

              {data && (
                <CardContent className={classes.detail}>
                  <TableContainer
                    component={Paper}
                    className={classes.tableContainer}
                  >
                    <Table
                      className={classes.table}
                      size="small"
                      aria-label="result table"
                    >
                      <TableHead className={classes.tableHead}>
                        <TableRow className={classes.tableRow}>
                          <TableCell className={classes.tableCell1}>
                            Hasil Diagnosis
                          </TableCell>
                          <TableCell
                            align="right"
                            className={classes.tableCell1}
                          >
                            Tingkat Keyakinan
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody className={classes.tableBody}>
                        <TableRow className={classes.tableRow}>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.tableCell}
                          >
                            {data.class}
                          </TableCell>
                          <TableCell align="right" className={classes.tableCell}>
                            <span className={classes.confidenceBadge}>
                              {confidence}%
                            </span>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              )}

              {isLoading && (
                <CardContent className={classes.loaderWrapper}>
                  <CircularProgress
                    size={36}
                    thickness={4}
                    className={classes.loader}
                  />
                  <Typography className={classes.loaderText} variant="body2">
                    Menganalisis gambar…
                  </Typography>
                </CardContent>
              )}
            </Card>
          </Grid>

          {/* Clear button */}
          {data && (
            <Grid item className={classes.buttonGrid}>
              <ColorButton
                variant="contained"
                className={classes.clearButton}
                color="primary"
                component="span"
                size="large"
                onClick={clearData}
                startIcon={<Clear fontSize="large" />}
              >
                Hapus & Ulangi
              </ColorButton>
            </Grid>
          )}
        </Grid>
      </Container>
    </React.Fragment>
  );
};