import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SessionContext } from "../contexts/SessionContext";
import axios from "axios";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import "../login-signup.css";

function LoginForm(props) {
  const navigate = useNavigate();
  const { setToken } = useContext(SessionContext);
  const [isInvalidLogin, setIsinvalidLogin] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://why-do-i-know-that.adaptable.app/auth/login",
        { username, password }
      );

      if (response.status === 200) {
        setToken(response.data);
        if (!props.gameUserName) {
          navigate("/");
        }
      }
    } catch (error) {
      if (error.response.data === "incorrect password") {
        setIsinvalidLogin("incorrect password");
      } else {
        setIsinvalidLogin("invalid username");
      }
    }
  };
  return (
    <div className="signup-form">
      <Text
        fontSize={{ base: "1.2rem", md: "2rem", lg: "3rem" }}
        className="signup-form-text"
      >
        Login
      </Text>
      <form onSubmit={handleSubmit}>
        <FormControl isInvalid={true}>
          <FormLabel fontSize={{ base: "1rem", lg: "1.5rem" }}>
            Username
            <input
              type="text"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </FormLabel>
          {isInvalidLogin === "incorrect username" && (
            <FormErrorMessage
              fontSize={{ base: "0.5rem", md: "0.8rem" }}
              textAlign={"center"}
              display={"block"}
            >
              Username incorrect
            </FormErrorMessage>
          )}
          <FormLabel fontSize={{ base: "1rem", lg: "1.5rem" }}>
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </FormLabel>
          {isInvalidLogin === "incorrect password" && (
            <FormErrorMessage
              fontSize={{ base: "0.5rem", md: "0.8rem" }}
              textAlign={"center"}
              display={"block"}
            >
              Incorrect password
            </FormErrorMessage>
          )}
        </FormControl>

        <button className="signup-btn" type="submit">
          <Box
            padding={{ base: "5px", md: "8px" }}
            fontSize={{ base: "1rem", lg: "1.5rem" }}
          >
            Login
          </Box>
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
