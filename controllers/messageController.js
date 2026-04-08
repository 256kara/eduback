const User = require("../models/User");
const School = require("../models/School");
const Message = require("../models/Message");

// create message using the school name
exports.createmsg = async (req, res) => {
  try {
    const { title, content, school_name } = req.body;

    const school_exist = await School.findOne({ name: school_name });

    if (!school_exist) {
      return res.json({ error: "No such school" });
    }

    const msg_exists = await Message.findOne({ title, content, school_name });
    if (msg_exists) {
      return res.json({ error: "Message exists." });
    }
    const new_msg = new Message({
      title,
      content,
      school: school_exist._id,
    });
    await new_msg.save();
    res.json(new_msg);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

//  get messages depending from the id
exports.getmessageges = async (req, res) => {
  try {
    const { id } = req.params;

    // sort messages by createdAt in descending order
    const messages = await Message.find({ school: id })
      .sort({ createdAt: -1 })
      .populate("school");

    res.json(messages);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// delete message depending on its id
exports.deletemessage = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    res.json({ message: "Message deleted successfully." });
  } catch (err) {
    res.status(400).json(err.message);
  }
};
