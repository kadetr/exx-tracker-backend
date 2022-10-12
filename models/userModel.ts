import mongoose, {Schema} from "mongoose";
import bcrypt from "bcryptjs";
import { IUserDoc } from "../types/custom";

const userSchema = new Schema<IUserDoc>(
   {
      name: {
         type: String,
         required: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
      },
      password: {
         type: String,
         required: true,
      },
      isAdmin: {
         type: Boolean,
         required: true,
         default: false,
      },
   },
   {
      timestamps: true,
   }
);

userSchema["methods"].matchPassword = async function (enteredPassword: string) {
   const res = await bcrypt.compare(enteredPassword, this.password);
   return res;
};

//userSchema.method('matchPassword', async function (enteredPassword: string) {
  // const res: any = await bcrypt.compare(enteredPassword, this.password);
   //return res;
 //})


userSchema.pre("save", async function (next) {
   if (!this.isModified("password")) {
      next();
   }

   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model<IUserDoc>('User', userSchema);

//const User = mongoose.model("User", userSchema);

export default User;
