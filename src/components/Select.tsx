import { cn } from "@/lib/utils";
import {
  Select as SelectPrimitive,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { ReactNode } from "react";

type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  options?: SelectOption[];
  size?: "sm" | "default";
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  children?: ReactNode;
};

const Select = ({
  value,
  defaultValue,
  onChange,
  placeholder,
  options,
  size = "default",
  disabled,
  className,
  triggerClassName,
  contentClassName,
  itemClassName,
  children,
}: SelectProps) => {
  return (
    <div className={cn("w-full", className)}>
      <SelectPrimitive
        value={value}
        defaultValue={defaultValue}
        onValueChange={onChange}
      >
        <SelectTrigger
          size={size}
          disabled={disabled}
          className={cn("w-full", triggerClassName)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={cn("w-full", contentClassName)}>
          {options && options.length > 0
            ? options.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  className={itemClassName}
                >
                  {opt.label}
                </SelectItem>
              ))
            : children}
        </SelectContent>
      </SelectPrimitive>
    </div>
  );
};

export default Select;
