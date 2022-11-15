const userModel = require("../model/model");
const jwt = require("jsonwebtoken");
const validator = require("../middleware/validator");
const secretKey = "JayVision";
const axios = require('axios')

//Creating Author documents by validating the details.
const createUser = async function (req, res) {
  try {
    // Request body verifying
    let requestBody = req.body;
    

    if (!validator.isValidRequestBody(requestBody)) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Invalid request parameter, please provide author Detaills",
        });
    }

    //Extract body params
    const { name,phone_number,email, field,country,coutry_code } = requestBody;

    // Validation started & detecting here the falsy values .
    if (!validator.isValid(name)) {
      return res
        .status(400)
        .send({ status: false, message: "First name is required" });
    }
    if (!validator.isValid(field)) {
      return res
        .status(400)
        .send({ status: false, message: "Last name is required" });
    }
    if (!validator.isValid(country)) {
      return res
        .status(400)
        .send({ status: false, message: "Title is required" });
    }
   
    if (!validator.isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: `Email is required` });
    }

    //Email validation whether it is entered perfectly or not.
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      res.status(400).send({status: false,message: `Email should be a valid email address`});
      return;
    }

    
    const isEmailAlredyUsed = await userModel.findOne({ email });
    if (isEmailAlredyUsed) {
      return res
        .status(400)
        .send({
          status: false,
          message: `${email} email address is already registered`,
        });
    }
    //validation Ends

    if (!validator.isValid(phone_number)) {
      return res.status(400).send({ status: false, message: 'Phone no is required' })
  }
  //check for unique phone no
  const isNoAlreadyUsed = await userModel.findOne({ phone_number })
  if (isNoAlreadyUsed) {
      return res.status(400).send({ status: false, message: 'This phone no is Already registered' })
  }
  //check for valid no
  if (!(/^[6-9]\d{9}$/.test(phone_number))) {
      return res.status(400).send({ status: false, message: 'Invalid phone no.' })
  }

  ////////////////////////////////axiose//////
  let options = {
    method: "get",
    url: `https://restcountries.com/v2/callingcode/${coutry_code}`
}
let result = await axios(options);
let cdetail = result.data

/////////////////////////

    const newAuthor = await userModel.create(requestBody);
    return res
      .status(201)
      .send({
        status: true,
        message: `Author created successfully`,
        data: newAuthor,
        country_detail : cdetail
      });
  } catch (error) {
    res.status(500).send({ status: false, Error: error.message });
  }
};



//Login author Handler - Author won't be able to login with wrong credentials.
const loginUser = async function (req, res) {
  try {
    const requestBody = req.body;
    if (!validator.isValidRequestBody(requestBody)) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Invalid request parameters. Please provide login details",
        });
    }

    //Extract params
    let { name, email } = requestBody;

    //Validation starts -
    if (!validator.isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: `Email is required for login` });
    }

    //Email validation whether it is entered perfectly or not.
    email = email.trim();
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      res
        .status(400)
        .send({
          status: false,
          message: `Email should be a valid email address`,
        });
      return;
    }
    if (!validator.isValid(name)) {
      //Password is entered correctly or not.
      return res
        .status(400)
        .send({ status: false, message: `Password is mandatory for login` });
    }
    //Validitions ends

    const findStudent = await userModel.findOne({ email, name }); //finding author details in DB to get a match of the provided Email and password.

    if (!findStudent) {
      return res
        .status(401)
        .send({
          status: false,
          message: `Invalid login credentials. Please check the details & try again.`,
        });
    }

    //creating JWT
    let token = jwt.sign({ userId: findStudent._id }, secretKey);
    res.header("x-api-key", token);
    res.cookie("x-api-key", token,{
      expires : new Date(Date.now()+9000000),
      httpOnly : true
    });


    return res
      .status(201)
      .send({
        status: true,
      message: `user login successfully`,
        data: { token },
      });
      
  } catch (error) {
    res.status(500).send({ status: false, Error: error.message });
  }
};



const getStudent = async function (req, res) {
  try {
   // let filterQuery = { isDeleted: false, deletedAt: null, isPublished: true };
    let queryParams = req.query;

   /* if (validator.isValidRequestBody(queryParams)) {
      const { phone_number,name, email, field,country, coutry_code } = queryParams
    
    }*/

    const blog = await userModel.findOne(queryParams);
    if(!blog){
      return res.status(400).send({status:false, message: "please enter valid data"})
    }
    let cd = blog.coutry_code
     ////////////////////////////////axiose//////
  let options = {
    method: "get",
    url: `https://restcountries.com/v2/callingcode/${cd}`
}
let result = await axios(options);
let cdetail = result.data

/////////////////////////

    if (Array.isArray(blog) && blog.length === 0) {
      return res.status(404).send({ status: false, message: "No blogs found" });
    }
    res.status(200).send({ status: true, message: "Blogs list", data: blog , country_detail : cdetail});
  } catch (error) {
    res.status(500).send({ status: false, Error: error.message });
  }
};


module.exports = {
  createUser,
  loginUser,
  getStudent,
};