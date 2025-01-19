export default function InputLabel({ value, className = '', children, ...props }) {

    let firstPartValue="";
    let secondPartValue="";

        if(value.indexOf("span")>0){
            firstPartValue=value.substring(0,value.indexOf("span"))
            secondPartValue=value.substring(value.indexOf("span")+4,value.length)
        }


    return (
        firstPartValue!=="" ?
        (<label {...props} className={`block font-bold text-md text-black ` + className}>
            {firstPartValue}<span className="text-sm text-blue-800">{secondPartValue}</span>
        </label>)
        :
        (<label {...props} className={`block font-bold text-md text-black ` + className}>
            {value ? value : children}
        </label>)
    );
}
