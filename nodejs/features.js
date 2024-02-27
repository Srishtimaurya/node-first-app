const gfname="sanaya";
const gf2="riyaa";
const gf3="siya";
// module.exports=gfname;

export default gfname;
export {gf2,gf3};


// now i want to export this below function in another file...

export const generatelove=()=>{
    return `${~~(Math.random()*100)}%`;
}