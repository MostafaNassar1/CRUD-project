// welcome email template
export const welcomeEmail = (name) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: #4CAF50; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">Welcome to CRUD App! 🎉</h1>
    </div>
    <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #333;">Hi ${name}!</h2>
        <p style="color: #666; line-height: 1.6;">Your account has been created successfully. You can now log in and start using the app.</p>
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="color: #333; margin: 0;"><strong>Account Details:</strong></p>
            <p style="color: #666; margin: 5px 0;">Name: ${name}</p>
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">This is an automated email, please do not reply.</p>
    </div>
</div>
`;

// account deleted email template
export const accountDeletedEmail = (name) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: #f44336; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">Account Deleted ❌</h1>
    </div>
    <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #333;">Hi ${name},</h2>
        <p style="color: #666; line-height: 1.6;">Your account has been deleted by an administrator. If you think this was a mistake, please contact support.</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">This is an automated email, please do not reply.</p>
    </div>
</div>
`;

// daily report email template
export const dailyReportEmail = (data) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: #2196F3; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">📊 Daily Report</h1>
        <p style="color: white; margin: 5px 0;">${new Date().toLocaleDateString()}</p>
    </div>
    <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f0f0f0;">
                <td style="padding: 12px; border: 1px solid #ddd;"><strong>Total Users</strong></td>
                <td style="padding: 12px; border: 1px solid #ddd;">${data.totalUsers}</td>
            </tr>
            <tr>
                <td style="padding: 12px; border: 1px solid #ddd;"><strong>Total Admins</strong></td>
                <td style="padding: 12px; border: 1px solid #ddd;">${data.totalAdmins}</td>
            </tr>
            <tr style="background-color: #f0f0f0;">
                <td style="padding: 12px; border: 1px solid #ddd;"><strong>Total Regular Users</strong></td>
                <td style="padding: 12px; border: 1px solid #ddd;">${data.totalRegularUsers}</td>
            </tr>
            <tr>
                <td style="padding: 12px; border: 1px solid #ddd;"><strong>New Users Today</strong></td>
                <td style="padding: 12px; border: 1px solid #ddd;">${data.newUsersToday}</td>
            </tr>
            <tr style="background-color: #f0f0f0;">
                <td style="padding: 12px; border: 1px solid #ddd;"><strong>Users With Photos</strong></td>
                <td style="padding: 12px; border: 1px solid #ddd;">${data.usersWithPhotos}</td>
            </tr>
        </table>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">This is an automated daily report email.</p>
    </div>
</div>
`;