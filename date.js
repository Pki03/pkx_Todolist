
console.log(module);

function getdate()
{
    var today = new Date();
    var x =today.getDay();
    
var options = {
    weekday:"long",
    day:"numeric",
    month:"long"

};

var day = today.toLocaleDateString("en-US",options);

return day;

}