import type { ComponentProps } from "react"

interface InputProps extends Omit<ComponentProps<"input">, "className"> {
  label: string
  name: string
}

export const Input = ({ label, name, ...props }: InputProps) => {
  return (
    <label htmlFor={name} className="plasmo-relative">
      <input
        type="text"
        id={name}
        placeholder=""
        className="plasmo-peer plasmo-mt-0.5 plasmo-w-full plasmo-rounded plasmo-border-gray-300 plasmo-shadow-sm plasmo-sm:text-sm"
        {...props}
      />

      <span className="plasmo-absolute plasmo-inset-y-0 plasmo-start-3 plasmo--translate-y-5 plasmo-bg-white plasmo-px-0.5 plasmo-text-sm plasmo-font-medium plasmo-text-gray-700 plasmo-transition-transform plasmo-peer-placeholder-shown:translate-y-0 plasmo-peer-focus:-translate-y-5">
        {label}
      </span>
    </label>
  )
}
