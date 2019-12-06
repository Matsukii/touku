module.exports = {
    app:{
        port: process.env.PORT || 3000,
    },
    polarpod:{
        root: 'https://polarpod.herokuapp.com/',
        paths:{
            apis: "https://polarpod.herokuapp.com/apis/",
            msgFilter: 'https://polarpod.herokuapp.com/apis/filter?msg=',
            ogtags: 'https://polarpod.herokuapp.com/apis/ogtags?u='
        }
    }
    
};
