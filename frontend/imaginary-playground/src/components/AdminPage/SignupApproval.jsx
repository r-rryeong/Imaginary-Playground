import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import Draggable from "react-draggable";
import swal from "sweetalert";
import axios from "axios";
import { useEffect } from "react";
import { config } from "../../util/config";

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const columns = [
  { field: "id", headerName: "id", width: 50 },
  { field: "email", headerName: "이메일", width: 180 },
  { field: "username", headerName: "이름", width: 130 },
  {
    field: "hospital_name",
    headerName: "병원 이름",
    width: 250,
  },
  {
    field: "hospital_address",
    headerName: "병원 주소",
    width: 600,
  },
  {
    field: "join_date",
    headerName: "가입 날짜",
    width: 200,
  },
  {
    field: "document",
    headerName: "이미지 파일 (셀 클릭하여 이미지 보기)",
    width: 250,
    sortable: false,
    description: "해당 셀을 클릭하시면 이미지를 볼 수 있습니다.",
    disableColumnFilter: true,
    disableColumnMenu: true,
  },
];

const SignupApproval = () => {
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [open, setOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(false);
  const [ApprovalUserData, setApprovalUserData] = useState([]);
  const [page, setPage] = useState(0);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const loginUserToken = localStorage.getItem("token");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    //전체 승인안된 전체 회원 개수
    axios({
      url: `${config.api}/admin/lookup/all/2`, //마지막은 페이지번호
      method: "GET",
    }).then((res) => {
      //console.log(res);
      if (res.data.status === "SUCCESS") {
        setApprovalUserData(res.data.data);
      } else {
        swal("에러!", "문의글 생성에 실패하였습니다.", "error");
      }
    });

    //승인안된 회원 페이지별 조회
    // axios({
    //   url: `${config.api}/admin/lookup/w/${page}`, //마지막은 페이지번호
    //   method: "GET",
    // }).then((res) => {
    //   console.log(res);
    //   setApprovalUserData(res);
    // });
  }, [dataUpdate]);

  const handleSelectRow = (id) => {
    const tempSelectedRowData = [];
    id.forEach((element) => {
      const RowData = ApprovalUserData.filter(
        (row) => row.id === parseInt(element, 10)
      );
      tempSelectedRowData.push(...RowData);
    });

    setSelectedRowData(tempSelectedRowData);
  };

  //회원가입 승인
  const handleApprovalSubmit = () => {
    if (!selectedRowData.length) {
      swal("에러!", "회원가입 승인할 유저를 선택해주세요", "error");
      return;
    }

    swal({
      title: "",
      text: `현재 선택된 유저수는 ${selectedRowData.length}명 입니다.`,
      icon: "warning",
      buttons: true,
    }).then((Approval) => {
      if (Approval) {
        //비동기 통신(회원가입 승인, params로 받는다)

        const axiosRowData = selectedRowData.map((data) => {
          return data.email;
        });

        axios
          .post(`${config.api}/admin/`, axiosRowData, {
            headers: {
              Auth: loginUserToken,
            },
          })
          .then((res) => {
            console.log(res);
            if (res.data.status === "SUCCESS") {
              //데이터 업데이트 토글
              setDataUpdate(!dataUpdate);
              swal("승인이 완료 되었습니다.", {
                icon: "success",
              });
            } else {
              swal("에러!", "승인이 완료되지 않았습니다.", "error");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  //회원가입 거절
  const handleDenySubmit = () => {
    if (!selectedRowData.length) {
      swal("에러!", "회원가입 거절할 유저를 선택해주세요", "error");
      return;
    }
    swal({
      title: "",
      text: `현재 선택된 유저수는 ${selectedRowData.length}명 입니다.`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        //비동기 통신(회원가입 거절)

        const axiosRowData = selectedRowData.map((data) => {
          return data.email;
        });

        axios({
          url: `${config.api}/admin/`,
          method: "DELETE",
          data: axiosRowData,
        })
          .then((res) => {
            console.log(res);
            if (res.data.status === "SUCCESS") {
              //데이터 업데이트 토글
              setDataUpdate(!dataUpdate);
              swal("거절이 완료 되었습니다.", {
                icon: "success",
              });
            } else {
              swal("에러!", "거절이 완료되지 않았습니다.", "error");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };
  return (
    <div style={{ height: "85vh", width: "100%" }}>
      <DataGrid
        sx={{ cursor: "pointer" }}
        rows={ApprovalUserData}
        columns={columns}
        pageSize={15}
        rowsPerPageOptions={[15]}
        checkboxSelection
        onSelectionModelChange={handleSelectRow}
        onCellClick={(e) => {
          if (e.field === "image_file_url") {
            handleClickOpen();
          }
        }}
        pagination
        disableSelectionOnClick
        onPageChange={(page) => {
          setPage(page);
        }}
      />
      <Grid
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "end",
          alignItems: "center",
          marginTop: "5px",
        }}
      >
        <Button
          variant="contained"
          startIcon={<BeenhereIcon />}
          size="large"
          onClick={handleApprovalSubmit}
        >
          <span>승인</span>
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{ marginLeft: ".5rem" }}
          size="large"
          startIcon={<DeleteIcon />}
          onClick={handleDenySubmit}
        >
          <span>거절</span>
        </Button>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        scroll="body"
        fullScreen={isMobile}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <span
            style={{
              fontFamily: "IBM Plex Sans KR",
              fontWeight: "bold",
              display: "block",
              textAlign: "center",
              color: "#1976d2",
            }}
          >
            이미지 파일
          </span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <img
              src="/img/AdminPage/재직증명서.jpg"
              alt="재직증명서"
              width={"100%"}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            <span
              style={{
                fontFamily: "IBM Plex Sans KR",
                fontWeight: "bold",
                display: "block",
                textAlign: "center",
                color: "#1976d2",
              }}
            >
              확인
            </span>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SignupApproval;
