import {fetchMessages, saveMessage} from '../db/messages.js'

const getMessages = async (req, res) => {
  const { room } = req.query;
  try {
     const messages = await fetchMessages(room);
     res.json({success: true, msg: 'successfully fetched messages', messages});
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Failed to fetch messages', details: err.message });
  }
};

const saveMessages = async (req, res) => {
  const { content, room } = req.body;
  try {
    const message = await saveMessage({content, room, userId: req.user.id})
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Failed to save message', details: err.message });
  }
}

export {
  getMessages,
  saveMessages
}