const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, callback){
        callback(null, file.fieldname + '' + Date.now());
    }
});
const upload = multer({storage:storage}).array('userVideo', 2);

// router.get('/upload', function(req,res){
//     res.render("videos/upload.hbs");
// });

router.get('/upload', function(req,res){
   res.send(__dirname, '/views', "videos/upload.hbs");
});

router.post('/api/video', function (req,res) {
    upload(req,res,function(err){
        console.log(req.body);
        console.log(req.files);
        if (err){
            return res.end('error uploading files')
        }
        res.end("File upload complete!")
    })
});

router.get('/', function(req,res,next){
    res.render('videos/index');
});

router.get('/all', function(req,res,next){
   res.render('videos/all'); 
});



module.exports = router;