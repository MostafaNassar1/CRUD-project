import cron from "node-cron";
import { v2 as cloudinary } from "cloudinary";
import prisma from "../prisma/client.js";

//CRON 1: Auto delete old photos from cloudinary
//runs every Sunday at midnight
// Finds users with no photos and cleans up orphaned files
cron.schedule("0 0 * * 0", async() => {
    console.log("🧹Running: Auto delete old photos from Cloudinary...");
    try {
        //get all users that have photos
        const users = await prisma.user.findMany({
            where:{
                photo: {isEmpty: false}
            }
        });

        let deletedCount = 0;

        for(const user of users){
            //check if photo still exists on cloudinary
            for(const photoUrl of user.photo){
                try {
                    const imagesTypes = /\.(jpg|jpeg|png|gif|svg)$/i;
                    let resourceType = "raw";
                    if(imagesTypes.test(photoUrl)) resourceType = "image";

                    //get public Id from cloudinary URL
                    const publicId = photoUrl.split("/").slice(-2).join("/").split(".")[0];

                    // check if resource exists on cloudinary
                    const result = await cloudinary.api.resource(publicId, {
                        resource_type: resourceType
                    });

                    //if created more than 30 days ago -> delete
                    const createdAt = new Date(result.created_at)
                    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

                    if(createdAt < thirtyDaysAgo){
                        await cloudinary.uploader.destroy(publicId, {
                            resource_type: resourceType
                        });

                        //remove from user's photo array in DB
                        await prisma.user.update({
                            where: {id: user.id},
                            data: {
                                photo: user.photo.filter(p => p !== photoUrl)
                            }
                        });

                        deletedCount++;
                        console.log(`Deleted old photo: ${publicId}`);
                    }
                } catch (error) {
                    //photo doesnt exist on cloudinary - remove from DB
                    await prisma.user.update({
                        where: {id:user.id},
                        data: {
                            photo: user.photo.filter(p => p !== photoUrl)
                        }
                    });
                    console.log(`removed orphaned photo from DB: ${photoUrl}`);
                    
                }
            }
        }
        console.log(`Photo cleanup complete. Deleted ${deletedCount} old photos.`);
    } catch (error) {
        console.error("Photo cleanup error: ", error.message);     
    }
});

//CRON 2: Generate daily report
//runs everyday at midnight
cron.schedule("0 0 * * *", async() => {
    console.log("Running: Generating daily report...");
    try {
        //total users
        const totalUsers = await prisma.user.count();

        //total admins
        const totalAdmins = await prisma.user.count({
            where: {role: "admin"}
        });

        //total regular users
        const totalRegularUsers = await prisma.user.count({
            where: {role: "user"}
        });

        //new users registered
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const newUsersToday = await prisma.user.count({
            where: {
                createdAt:{gte: today}
            }
        });

        //users with photos
        const userWithPhotos = await prisma.user.count({
            where: {
                photo: { isEmpty: false }
            }
        });

            console.log("\n======================================");
            console.log("DAILY USER REPORT");
            console.log("========================================");
            console.log(`📅 Date               : ${new Date().toLocaleString()}`);
            console.log("----------------------------------------");
            console.log(`👥 Total Users        : ${totalUsers}`);
            console.log(`🛡️  Total Admins      : ${totalAdmins}`);
            console.log(`🙋 Regular Users      : ${totalRegularUsers}`);
            console.log(`🆕 New Users Today    : ${newUsersToday}`);
            console.log(`    Users With Photos : ${userWithPhotos}`);
            console.log("----------------------------------------");
            console.log("✅ Report Generated Successfully");
            console.log("========================================\n");
        
    } catch (error) {
        console.error("❌ Daily report error:", error.message);
    }
});

console.log("Cron Jobs scheduled Successfully");