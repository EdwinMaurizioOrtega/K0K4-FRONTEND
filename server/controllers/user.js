// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModal from "../models/user.js";

const secret = 'test';

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (!oldUser) return res.status(404).json({ message: "El usuario no existe" });

    //Contraseña encriptada
    //const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    const isPasswordCorrect =  password === oldUser.password;

    if (!isPasswordCorrect) return res.status(400).json({ message: "Credenciales no válidas" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Algo salió mal" });
  }
};

export const signup = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (oldUser) return res.status(400).json({ message: "El usuario ya existe" });

    // Encriptar contraseña
    //const hashedPassword = await bcrypt.hash(password, 12);

    const hashedPassword = password;

    const result = await UserModal.create({ email, password: hashedPassword, name: username });

    const token = jwt.sign( { email: result.email, id: result._id }, secret, { expiresIn: "1h" } );

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Algo salió mal" });
    
    console.log(error);
  }
};
