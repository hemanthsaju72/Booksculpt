import React from "react";
import "./Card.scss";
import { Link } from "react-router-dom";

import { useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { addToCart } from "../../redux/cartReducer";
import { message } from "antd";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Card = ({ item }) => {
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);

  const success = () => {
    dispatch(
      addToCart({
        id: item._id,
        title: item.title,
        desc: item.description,
        price: item.price,
        img: item.publisher,
        quantity: 1,
      })
    );

    message.success("Book has been added to cart");
  };

  const handleClose = () => setOpen(false);

  const handleViewDetails = () => {
    window.open(`/books/${item._id}`, '_blank');
  };

  
  return (
    <>
      <div className="card">
        <Link className="link">
          <div className="image">
            <img src={item.image} alt="" className="mainImg" />
          </div>
          <p
            style={{
              textAlign: "center",
              marginBottom: "10px",
              fontSize: "20px",
              fontFamily: "Josefin Sans",
              fontWeight: "bold",
            }}
          >
            {item.title}
          </p>
        </Link>
        <div>
          <Button
            variant="contained"
            onClick={handleViewDetails}
            disableElevation
            fullWidth
          >
           VIEW DETAILS
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {item.title}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {item.description}
              </Typography>
            </Box>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Card;
