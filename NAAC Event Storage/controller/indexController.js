
const index1 = (req, res, next) => {
    // const data = {
    //   title: 'Storage',
    //   description: 'NAAC Event Storage',
    //   keywords: 'NAAC Event Storage'
    // }
    
    const data = "NAAC";
    res.render('index', {data});
    };

module.exports = {
    index1
};