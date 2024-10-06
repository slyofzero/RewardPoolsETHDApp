import { ChangeEvent, useId } from "react";
import { InputProps } from "./types";
import { ShowWhen } from "../..";
import { classNames } from "@/utils";
import { inputCva } from "./cva";
import { useInputValidation } from "@/hooks";

export function Input({
  className = "",
  match,
  label,
  labelClassName = "",
  type,
  required,
  containerClassName,
  onChange,
  showErrorText,
  ...props
}: InputProps) {
  const fieldId = useId();
  const { checkValidation, ref, validationError } =
    useInputValidation<HTMLInputElement>({
      match,
      required,
    });

  const labelComponent = (
    <label
      className={classNames("fw-bold text-sm ml-4", labelClassName)}
      htmlFor={fieldId}
    >
      {label}
    </label>
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    onChange?.(e);
    checkValidation(value);
  };

  const headerLikeComponent = (
    <div className="flex justify-between">
      <ShowWhen component={labelComponent} when={label} />
      <span className="text-red-500">{validationError}</span>
    </div>
  );

  return (
    <div className={classNames(inputCva({ type }), containerClassName || "")}>
      <ShowWhen
        component={headerLikeComponent}
        when={label || (validationError && showErrorText)}
      />

      <input
        id={fieldId}
        ref={ref}
        className={classNames(
          "bg-black rounded-md border-[1.5px] outline-none p-2 placeholder:text-white/75",
          className,
          validationError ? "border-red-500" : "border-white"
        )}
        // @ts-ignore
        onChange={onChange || handleInputChange}
        required={required}
        onInvalid={(e: ChangeEvent<HTMLInputElement>) => {
          e.preventDefault();
          const { value } = e.target;
          checkValidation(value);
        }}
        onInput={(e: ChangeEvent<HTMLInputElement>) => {
          e.target.setCustomValidity("");
        }}
        {...props}
      />
    </div>
  );
}
