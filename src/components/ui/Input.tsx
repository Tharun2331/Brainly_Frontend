interface InputProps {
  placeholder: string;
  ref?:any;
  required: boolean;
}

export function Input({ref, placeholder, required}: InputProps) {
  return <div>
      <input placeholder={placeholder} type="text" className="px-4 py-2 border-1 border-gray-300 m-2" ref={ref} required= {required}/>
  </div>
}


export function MultiInput({ref, placeholder, required}:InputProps)
{
  return <div>
  <textarea placeholder={placeholder} ref={ref} required={required}  className="px-4 py-2 border-1 border-gray-300 m-2" />
  </div>
}