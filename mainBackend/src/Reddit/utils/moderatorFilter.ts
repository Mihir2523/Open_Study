import { GoogleGenerativeAI } from "@google/generative-ai";

const hasGeminiKey = !!process.env.GEMINI_API_KEY;
const genAI = hasGeminiKey ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string) : null as any;

export interface Result{
    isAppropriate:boolean,
    isRelated:boolean,
    reason:string
}

export async function Analyze(comment:string,post:any,flag:boolean){
    try{
        if(!hasGeminiKey){
            return {
                isAppropriate:true,
                isRelated:true,
                reason:"Moderation skipped: GEMINI_API_KEY not configured"
            } as Result;
        }
        const model = genAI.getGenerativeModel({model:"gemini-1.5-flash-latest"});
        let promt;
        if(flag){
        promt = `
            You are a content moderation AI. Your task is to analyze a user's comment based on a given topic.
            You must determine two things:
            1.  Is the comment appropriate? (i.e., not spam, harassment, hate speech, or offensive).
            2.  Is the comment related to the topic?
            
            The given comment is in string but the content is an Object of Javascript stringified
            The content object may contains fields like topic ,message,description ,etc....
            The content is like Posts on twitter or Reddit it has a title ,some description and others and you have to be in middle to act as a filter
            If the comment is Off the topic but not abusive or hate comment or harrasement it is fine it can be shown.
            If the comment is speaking truth even it seems wrong it can be considered appropriate.
            It can be considered as appropriate in above cases but other than that is it bad.
            The content is => "${JSON.stringify(post)}"
            The comment to analyze is => "${comment}"

            Please respond ONLY with a JSON object in the following format, with no other text or explanations before or after the JSON:
            {
              "isAppropriate": boolean,
              "isRelated": boolean,
              "reason": "A brief explanation for your decision."
            }
            `;
        }else{
            promt = promt = `
            You are a content moderation AI. Your task is to analyze a user's content
            You must determine two things:
            1.  Is the content appropriate? (i.e., not spam, harassment, hate speech, or offensive).
            2.  Is the content related to the knowledge ,study and valid fields of knowledge gaining?
            
            The given content is an Object of Javascript stringified
            The content object may contains fields like topic ,message,description ,etc....
            The content is like Posts on twitter or Reddit it has a title ,some description and others and you have to be in middle to act as a filter
            If the content is Off the topic but not abusive or hate comment or harrasement it is fine it can be shown.
            If the content is speaking truth even it seems wrong it can be considered appropriate.
            It can be considered as appropriate in above cases but other than that is it bad.
            If the content data is has some People's Name and they are targetting that person in the post it is invalid.
            If content has data like talking like Hi ,hello,etc.... it is also now considered valid.
            
            The content is => "${JSON.stringify(post)}"
            
            
            Please respond ONLY with a JSON object in the following format, with no other text or explanations before or after the JSON:
            {
              "isAppropriate": boolean,
              "isRelated": boolean,
              "reason": "A brief explanation for your decision."
            }
            `;
        }
        const result = await model.generateContent(promt);
        const text = result.response.text();
        const startIndex = text.indexOf('{');
        const endIndex = text.lastIndexOf('}');

        if (startIndex === -1 || endIndex === -1) {
            throw new Error("No valid JSON object found in the model's response.");
        }

        const jsonString = text.substring(startIndex, endIndex + 1);
        
        const finalResult:Result = JSON.parse(jsonString);
        return finalResult;
    }catch(e){
        console.log(e);
        return {
            isAppropriate:true,
            isRelated:true,
            reason:"Moderation skipped due to error"
        }
    }
}