import bcrpt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';
import User from "../models/user.js"
import dotenv from "dotenv";


dotenv.config();
const secret = process.env.SECRET;

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {

    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(404).json({ message: "User doesn't exist" });
    const isPasswordCorrect = await bcrpt.compare(password, existingUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, secret, { expiresIn: "1h" });

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    if (error.message === "User doesn't exist") {
      return res.status(404).json({ message: "User doesn't exist" });
    } else if (error.message === "Invalid credentials") {
      return res.status(400).json({ message: "Invalid credentials" });
    } else {
      return res.status(500).json({ message: "Something went wrong" });
    }

  }
}

export const changePassword = async (req, res) => {
  const { email, password, changedPass } = req.body;
  console.log(changedPass)
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(404).json({ message: "User doesn't exist" });
    const isPasswordCorrect = await bcrpt.compare(password, existingUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });
    const hashedNewPassword = await bcrpt.hash(changedPass, 12);
    existingUser.password = hashedNewPassword;

    // Save the updated user object with the new password
    await existingUser.save();
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {

  }
}

export const signup = async (req, res) => {
  const { email, password, confirmPassword, name, mobileNumber, post, category, entryNumber } = req.body;
  console.log(req.body)
  try {
    const existingUser = await User.findOne({ email });
    console.log(existingUser)
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match" });
    const hashedPassword = await bcrpt.hash(password, 12);
    console.log(hashedPassword)
    const result = await User.create({ email: email, password: hashedPassword, name: name, post: post, mobileNumber: mobileNumber, category: category, entryNumber: entryNumber })
    console.log(result)
    const token = jwt.sign({ email: result.email, id: result._id }, secret, { expiresIn: "1h" });
    console.log(token)
    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

  }
}
export const profile = async (req, res) => {
  const { id } = req.params;
  try {
    const { name, email,mobileNumber,category,entryNumber, post, _id } = await User.findById(id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json({ name, email,mobileNumber,category,entryNumber, post, _id });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name _id email post mobileNumber category entryNumber');

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const notification_1 = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    console.log(data, id);
    const notification = {
      message: `${data.name} has ${data.status} for ${data.session}`,
      createdAt: new Date().toISOString(),
    };
    const user = await User.findOne({ _id: id });
    user.notifications.push(notification);

    await user.save();

    res.status(200).json({ message: 'Notification added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const notification = async (req, res) => {
  try {
    const data = req.body;
    const notification = {
      message:`The Club ${data.name} has requested for ${data.RoomName}`,
      createdAt: new Date().toISOString()
    };

    //const user = await User.findOne({ category: `Overall_${data.category}`, post: "Admin_1" });
    const user_1 = await User.findOne({ category: `Overall_${data.category}`, post: "Admin_2" });
    //const user_2 = await User.findOne({ category: "Overall" });

    const usersToUpdate = [];

    //if (user) usersToUpdate.push(user);
    if (user_1) usersToUpdate.push(user_1);
    //if (user_2) usersToUpdate.push(user_2);

    if (usersToUpdate.length === 0) {
      return res.status(404).json({ message: 'Users not found' });
    }

    usersToUpdate.forEach((userToUpdate) => {
      userToUpdate.notifications.push(notification);
    });
    await Promise.all(usersToUpdate.map((userToUpdate) => userToUpdate.save()));

    return res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
export const notification_3 = async (req, res) => {
  try {
    const data = req.body;

    const notification = {
      message: `The Club ${data.name} has requested for ${data.RoomName}`,
      createdAt: new Date().toISOString(),
    };

    const user = await User.findOne({ category: `Overall_${data.category}`, post: "Admin_1" });

    const usersToUpdate = [];

    if (user) usersToUpdate.push(user);

    if (usersToUpdate.length === 0) {
      return res.status(404).json({ message: 'Users not found' });
    }

    usersToUpdate.forEach((userToUpdate) => {
      userToUpdate.notifications.push(notification);
    });
    await Promise.all(usersToUpdate.map((userToUpdate) => userToUpdate.save()));

    return res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const notification_4 = async (req, res) => {
  try {
    const data = req.body;
    const notification = {
      message:`The Club ${data.name} has requested for ${data.RoomName}`,
      createdAt: new Date().toISOString()
    };

    //const user = await User.findOne({ category: `Overall_${data.category}`, post: "Admin_1" });
    //const user_1 = await User.findOne({ category: `Overall_${data.category}`, post: "Admin_2" });
    const user_2 = await User.findOne({ category: "Overall" });

    const usersToUpdate = [];

    //if (user) usersToUpdate.push(user);
    //if (user_1) usersToUpdate.push(user_1);
    if (user_2) usersToUpdate.push(user_2);

    if (usersToUpdate.length === 0) {
      return res.status(404).json({ message: 'Users not found' });
    }

    usersToUpdate.forEach((userToUpdate) => {
      userToUpdate.notifications.push(notification);
    });
    await Promise.all(usersToUpdate.map((userToUpdate) => userToUpdate.save()));

    return res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const fetchNotify=async(req,res)=>{
  const {id}=req.params;
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const notifications = user.notifications;
    //console.log(notifications)
    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });

  }
}

export const clearNotify=async(req,res)=>{
  const {id}=req.params;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { notifications: [] }, 
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Notifications cleared successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });

  }
}