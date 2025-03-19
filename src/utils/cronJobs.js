
const { subDays, startOfDay, endOfDay } = require("date-fns");
const cron=require("node-cron");
const ConnectionRequest = require("../models/connectionRequest");
const sendEmail=require("../utils/sesSendMail")

cron.schedule("0 8 * * 1",async ()=>
{
   const yestarday= subDays(new Date(),1)

   const yestardayStartDay= startOfDay(yestarday);
   const yestardayEndDay=endOfDay(yestarday);
    try
    {
      const pendingRequest= await ConnectionRequest.find({
        status:"interested",
        createdAt:{
            $gte: yestardayStartDay,
            $lt:yestardayEndDay,

        }
      }).populate("fromUserId toUserId");
      console.log(pendingRequest);

      const ListOfemail=[... new Set(pendingRequest.map((req)=>req.toUserId.emailId))];
      console.log(ListOfemail)
      for(const email of ListOfemail)
      {
        try
        {
           const res= await  sendEmail.run("You have got new Request from "+email,"there are so many request for you.Please view your Requests in devtinder.onmine")
        }
        catch(err)
        {
            console.log(err)
        }
          

      }


    }
   catch(err)
   {
    console.log(err);
   }





});
