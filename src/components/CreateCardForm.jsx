import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/Deck.css";
const { VITE_BACKEND_URL } = import.meta.env;

function CreateCardForm({
  cards,
  setCards,
  index,
  setCardFields,
  setValueFields,
}) {
  const [img, setImage] = useState(cards[index].img);
  const [text, setText] = useState(cards[index].text);
  const [value, setValue] = useState(cards[index].value);
  const [isSubmited, setIsSubmited] = useState(false);
  const [isUrl, setIsUrl] = useState(false);

  const defaultImg =
    "https://climate.onep.go.th/wp-content/uploads/2020/01/default-image-300x225.jpg";

  const uploadImage = async (event) => {
    event.preventDefault();
    const fData = new FormData();
    const image = event.target[2].files[0];
    fData.append("imageUrl", image);
    try {
      const response = await axios.post(
        VITE_BACKEND_URL + "/decks/cloudinary",
        fData
      );
      const copyArray = [...cards];
      const copyObject = copyArray[index];
      if (response.status === 201) {
        const updatedObject = {
          ...copyObject,
          img: response.data,
        };
        copyArray[index] = updatedObject;
        setImage(response.data);
        setCards(copyArray);
        setIsSubmited(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCard = (event) => {
    const copyArray = [...cards];
    const copyObject = copyArray[index];
    let updatedObject;
    if (event.target.name === "img" && event.target.value.length === 0) {
      updatedObject = {
        ...copyObject,
        img: defaultImg,
      };
    } else {
      updatedObject = {
        ...copyObject,
        [event.target.name]: event.target.value,
      };
    }

    copyArray[index] = updatedObject;
    setCards(copyArray);
  };

  useEffect(() => {
    if (img.length > 0 && text.length > 0 && value) {
      setCardFields(true);
    } else {
      setCardFields(false);
    }
  }, [img, text, value]);

  useEffect(() => {
    if (img.length === 0) {
      setImage(defaultImg);
    }
  }, [img]);

  return (
    <form
      className="cardForm"
      onSubmit={uploadImage}
      encType="multipart/form-data"
    >
      <h3 className="mainText fontBasics">Card {index + 1}</h3>
      <img
        src={cards[index].img}
        onError={(event) => {
          event.target.src = defaultImg;
          event.onerror = null;
        }}
      />
      <label className="fontBasics"> Picture </label>
      {isUrl ? (
        <div className="imageForm">
          <button
            className="imageButtonOn inputG"
            type="button"
            onClick={() => setIsUrl(true)}
          >
            Copy Url
          </button>
          <button
            className="imageButtonOff inputG"
            type="button"
            onClick={() => setIsUrl(false)}
          >
            Upload file
          </button>
        </div>
      ) : (
        <div className="imageForm">
          <button
            className="imageButtonOff inputG"
            type="button"
            onClick={() => setIsUrl(true)}
          >
            Copy Url
          </button>
          <button
            className="imageButtonOn inputG"
            type="button"
            onClick={() => setIsUrl(false)}
          >
            Upload file
          </button>
        </div>
      )}
      {isUrl && (
        <input
          className="fontBasics inputG"
          name="img"
          // value={img}
          placeholder="Copy your url"
          onChange={(e) => {
            setImage(e.target.value);
            handleCard(e);
          }}
        ></input>
      )}
      {!isUrl && (
        <input
          className="fileInput fontBasics inputG"
          name="img"
          type="file"
          accept="image/jpg, image/png"
          // value={img}
        ></input>
      )}
      {isSubmited && !isUrl ? (
        <button className="submitImage inputG" type="submit">
          Submited!
        </button>
      ) : !isUrl ? (
        <button className="submitImage inputG" type="submit">
          Submit Image
        </button>
      ) : null}

      <label className="fontBasics"> Text </label>
      <input
        className="fontBasics inputG"
        name="text"
        value={text}
        onChange={(e) => {
          handleCard(e);
          setText(e.target.value);
        }}
      ></input>
      <label className="fontBasics"> Value </label>
      <input
        className="fontBasics inputG"
        type="number"
        name="value"
        value={value}
        onChange={(e) => {
          handleCard(e);
          setValue(e.target.value);
        }}
      ></input>
    </form>
  );
}

export default CreateCardForm;
