<!DOCTYPE html>
<html>
<head>
    <title>Welcome to BillSplit</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #10b981, #14b8a6); padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="color: white; margin: 0;">Welcome to BillSplit! 🎉</h1>
    </div>
    
    <div style="padding: 20px; background: #f9f9f9; border-radius: 10px; margin-top: 20px;">
        <p>Hi {{ $user->first_name }},</p>
        
        <p>Congratulations on creating your BillSplit account! We're excited to have you on board.</p>
        
        <p>With BillSplit, you can:</p>
        <ul>
            <li>Create bills to split with friends</li>
            <li>Track expenses easily</li>
            <li>Invite guests to participate in bills</li>
            <li>Keep everything organized in one place</p>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ url('/login') }}" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Login to Your Account
            </a>
        </div>
        
        <p>If you have any questions, feel free to reach out. Happy bill splitting!</p>
        
        <p>Best regards,<br>The BillSplit Team</p>
    </div>
    
    <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
        <p>&copy; {{ date('Y') }} BillSplit. All rights reserved.</p>
    </div>
</body>
</html>
