module.exports =  (fn) => {
    return function(req,res,next){
        fn(req,res,err).catch(next);
    }
 }