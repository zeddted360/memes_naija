import { IUser } from "@/app/types/types";
import { user } from "@/models/model";
import bcrypt from "bcrypt";

 const comparePassword = async (email:string,password:string) => {
    const foundUser:IUser | null = await user.findOne({ email });
    if (!foundUser) return null;
    return bcrypt.compare(password,foundUser.password);
}
export { comparePassword };