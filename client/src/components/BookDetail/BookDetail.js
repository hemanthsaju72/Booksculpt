import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { addToCart } from "../../redux/cartReducer";
import { message, Card } from "antd";
import { getBookId, getBookSubscription } from "../../redux/bookSlice";
import { useParams } from "react-router-dom";
import Box from '@mui/material/Box';
import axios from "axios";


const style = {
  position: 'absolute' ,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const BookDetails = ({ item }) => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [book, setBook] = useState({});
  const [subscribed, setSubscription] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(getBookId(id));
        setBook(data?.payload);
      } catch (error) {
        // Handle errors if any
        console.error("Error fetching book:", error);
      }
    };

    fetchData();
  }, []);

  const success = () => {
    dispatch(
      addToCart({
        id: book?._id,
        title: book?.title,
        desc: book?.description,
        price: book?.price,
        img: book?.publisher,
        quantity: 1,
      })
    );

    message.success("Book has been added to cart");
  };

  const checkSubscription = async () => {
    const response = await dispatch(getBookSubscription(id));
    setSubscription(response?.payload?.subscribed);
    if (response?.payload?.subscribed) window.open(book?.pdf, "_blank");
    else
      alert(
        "You don't have subscription to this particular book, Please subscribe!"
      );
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePayment = async () => {
    try {
      const res = await axios.post('http://localhost:8000/paybook', {
        products: [{"id":1,"desc":"subscribe","img":"ada","price":1500,"quantity":1,"title":"subscribe"}],
        userId: 'iduser',
        total: 1500
    });
      console.log(res);
      window.location = res.data.url;

    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <>
      <div
        className="card"
        style={{ marginTop: 40, marginLeft: 30, width: "80%" }}
      >
        <div>
          <div style={{ fontSize: 24, fontWeight: "bold", paddingBottom: 10 }}>
            {book?.title}
          </div>
          <Card
            style={{}}
            cover={
              <img src={book?.image} width="200px" height="500px"></img>
            }
          ></Card>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <div style={{ marginRight: "10px" }}>Pages: {book?.pages}</div>
            <div style={{ marginRight: "10px" }}>
              Published Year: {book?.publishedYear}
            </div>
            <div style={{ marginRight: "10px" }}>
              Publisher: {book?.publisher}
            </div>
          </div>

          <Card style={{}}>{book?.description}</Card>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Button
              variant="contained"
              onClick={() => checkSubscription()}
              disableElevation
              style={{ marginRight: "10px" }} // Add spacing between buttons
            >
              READ ME
            </Button>

            <Button variant="contained" onClick={success} disableElevation>
              ADD TO CART
            </Button>

            <Button variant="contained" style={{marginLeft:10}} onClick={handleOpen} >
              Subscribe Me
            </Button>
            <Button variant="contained" style={{marginLeft:10}} onClick={() =>window.open(book?.pdf, "_blank")} >
             Free Trial 
            </Button>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Subscribe Me
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Continue with subscription to read me
          </Typography>
          <Button variant="contained" onClick={handlePayment} >
              Subscribe Me
            </Button>
        </Box>
      </Modal>
    </>
  );
};

export default BookDetails;
