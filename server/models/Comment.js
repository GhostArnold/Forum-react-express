import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      require: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    postId: {
      // <-- Добавьте это поле
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Comment', CommentSchema);
