import mongoose from "mongoose";
const { Schema, models, model } = mongoose;

//user schema
const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    profilePic: String,
  },
  { timestamps: true }
);

//post schema
const PostSChema = new Schema(
  {
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    file: [String],

    author: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    comments: [
      {
        ref: "comment",
        type: Schema.Types.ObjectId,
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

//comment schema
const CommentSchema = new Schema(
  {
    content: String,
    file: [String],
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    replies: [
      {
        author: { type: Schema.Types.ObjectId, ref: "user" },
        reply: { type: String, required: true },
        file: [String],
        likes: [{ ref: "user", type: Schema.Types.ObjectId }],
        createdAt: {
          type: Date,
          default: () => Date.now(),
        },
      },
    ],
    likes: [
      {
        ref: "user",
        type: Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
);

// models
const user = models.user || model("user", UserSchema);
const post = models.post || model("post", PostSChema);
const comment = models.comment || model("comment", CommentSchema);

export { user, post, comment };
