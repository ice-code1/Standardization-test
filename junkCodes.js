// app.post("/api/verify", async (req, res) => {
//     const {temp_secretKey } = req.body;
//     const hash = crypto.createHash('sha256').update(temp_secretKey).digest('hex')
  
//     try {
//       const user = await User.findOne({  temp_secretKey });
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }
//       console.log(`Retrieved user data: ${JSON.stringify(user)}`);
  
//       //const { hash:hashed } = crypto.createHash('sha256').update(temp_secretKey).digest('hex')// user.temp_secretKey;
//       console.log(`Secret retrieved for verification: ${secretkey}`);
  
  
//       if (hash == temp_secretKey) {
//         user.temp_secretKey = user.secret; // Save the temp_secret as permanent secret
//         await user.save();
//         res.json({ verified: true });
//       } else {
//         res.json({ verified: false });
//       }
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: "Error finding user" });
//     }
//   });

// ///modularised code

//   app.post("/api/register", async (req, res) => {
//     const id = uuid.v4();
//     try {
//       const {email} = req.body
//       const secretKey = crypto.randomBytes(32);
//       const hash = crypto.createHash('sha256').update(secretKey).digest('hex')
      
//       const newUser = new User({
//         id,
//         email,
//         secretKey
//       });
//       await newUser.save();
//       console.log(`User registered with ID: ${id}, Secret: ${secretKey.toString('hex')}`);
//       res.json({ id, temp_secretKey: secretKey.toString('hex') });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: "Problem generating secret" });
//     }
//   });

const jwt = require('jsonwebtoken')

const token = jwt.sign(
  {userId:user.id},
  user.temp_secretKey,
  {expiresIn:'1hr'})

console.log(token)