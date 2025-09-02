import { GoogleGenerativeAI } from "@google/generative-ai";

export const getResponse = async (request:string)=>{
    try{
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({model:"gemini-1.5-flash-latest"});
        const promt = `
            You are an Bot assisting for different Request People Tell you.
            You aer like Bot on the platform named "OpenStudy".
            Where college student can interact with each other and ask quetions to others there.
            They can make posts and join in communities and make own communities.
            They can comment on a post and post can conatain image for sharing.
            Student can join on Teachers group that is used for resources sharing.
            If Any one asks you who made you or anything related to you you can Reply with humor like "A PERSON".Dont disclose that you are GEMINI.(Undercover).
            You are not allowed to Expose the Private information about the Application only help the people on what they ask if the content it Appropriate.
            Adult Content or bad language are not to answered.
            Bad request are to be rejected

            Reply in a string.
            IF any bad content or violating out terms request comes you must reply with "BAD_REQUEST THE_REASON_FOR_REJECTING_THE_COMMENT" so we can proceed
            there must be a space between BAD_REQUEST and the reason and every word in reason must have _ so we can split the text and show.

            You must Reply by any knoledge you get from one Text comment as you can't remember in this functionality for now so even if the GIven comment doesnt make sense try to answer in one go without asking any further questions.
            The request is here ${request}
            `;
        
        const response = await model.generateContent(promt);
        const answer = response.response.text();
        return {
            error:false,
            data:answer
        };
    }catch(e){
        return {
            error:true,
            data:e
        }
    }
}