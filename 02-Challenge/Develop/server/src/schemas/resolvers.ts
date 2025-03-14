import User from '../models/User.js';
import { signToken } from '../services/auth.js';

export const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      return await User.findById(context.user._id);
    },
  },
  Mutation: {
    login: async (_parent: any, { email, password }: { email: string; password: string }) => {
        console.log("🔍 Searching for user with email:", email);
        const user = await User.findOne({ email });
      
        if (!user) {
          console.log("❌ User not found in database");
          throw new Error('User not found');
        }
      
        console.log("✅ User found:", user);
      
        const correctPw = await user.isCorrectPassword(password);
        if (!correctPw) {
          console.log("❌ Incorrect password");
          throw new Error('Incorrect credentials');
        }
      
        console.log("✅ Password correct, generating token...");
        const token = signToken(user);
        return { token, user };
      },
    addUser: async (_parent: any, { username, email, password }: { username: string; email: string; password: string }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (_parent: any, { bookInput }: { bookInput: any }, context: any) => {
      if (!context.user) throw new Error('Not authenticated');

      return await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: bookInput } },
        { new: true, runValidators: true }
      );
    },
    removeBook: async (_parent: any, { bookId }: { bookId: string }, context: any) => {
      if (!context.user) throw new Error('Not authenticated');

      return await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
};