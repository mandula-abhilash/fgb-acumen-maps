"use client";

import React, { useState } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";

import { cn } from "@/lib/utils";

const CreatableSelect = React.forwardRef(
  (
    {
      className,
      options,
      onCreateOption,
      loadOptions,
      placeholder = "Select...",
      defaultValue,
      value,
      onChange,
      isMulti = false,
      isClearable = true,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState("");

    const customStyles = {
      control: (provided, state) => ({
        ...provided,
        backgroundColor: "hsl(var(--background))",
        borderColor: state.isFocused ? "hsl(var(--ring))" : "hsl(var(--input))",
        boxShadow: state.isFocused ? "0 0 0 1px hsl(var(--ring))" : "none",
        "&:hover": {
          borderColor: state.isFocused
            ? "hsl(var(--ring))"
            : "hsl(var(--input))",
        },
        borderRadius: "var(--radius)",
        minHeight: "40px",
        fontSize: "0.875rem", // Match text-sm
      }),
      menu: (provided) => ({
        ...provided,
        backgroundColor: "hsl(var(--background))",
        border: "1px solid hsl(var(--border))",
        borderRadius: "var(--radius)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        zIndex: 50,
      }),
      menuList: (provided) => ({
        ...provided,
        backgroundColor: "hsl(var(--background))",
        padding: "4px",
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected
          ? "hsl(var(--primary))"
          : state.isFocused
            ? "hsl(var(--accent))"
            : "hsl(var(--background))",
        color: state.isSelected
          ? "hsl(var(--primary-foreground))"
          : "hsl(var(--foreground))",
        cursor: "pointer",
        fontSize: "0.875rem", // Match text-sm
        "&:active": {
          backgroundColor: state.isSelected
            ? "hsl(var(--primary))"
            : "hsl(var(--accent))",
        },
      }),
      input: (provided) => ({
        ...provided,
        color: "hsl(var(--foreground))",
        fontSize: "0.875rem", // Match text-sm
      }),
      singleValue: (provided) => ({
        ...provided,
        color: "hsl(var(--foreground))",
        fontSize: "0.875rem", // Match text-sm
      }),
      multiValue: (provided) => ({
        ...provided,
        backgroundColor: "hsl(var(--secondary))",
        borderRadius: "9999px", // Full rounded for badge look
        margin: "2px 4px 2px 0",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        height: "24px", // Fixed height for consistency
      }),
      multiValueLabel: (provided) => ({
        ...provided,
        color: "hsl(var(--secondary-foreground))",
        fontSize: "0.875rem", // text-xs for badges
        paddingLeft: "12px", // Increased left padding for better spacing
        paddingRight: "6px", // Less right padding
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        height: "100%",
      }),
      multiValueRemove: (provided) => ({
        ...provided,
        color: "hsl(var(--secondary-foreground))",
        opacity: "0.8",
        padding: "0",
        "&:hover": {
          backgroundColor: "hsl(var(--destructive))",
          color: "hsl(var(--destructive-foreground))",
          opacity: "1",
        },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "24px", // Fixed width for the remove button
      }),
      indicatorSeparator: () => ({
        display: "none",
      }),
      dropdownIndicator: (provided) => ({
        ...provided,
        color: "hsl(var(--muted-foreground))",
      }),
      clearIndicator: (provided) => ({
        ...provided,
        color: "hsl(var(--muted-foreground))",
      }),
      placeholder: (provided) => ({
        ...provided,
        color: "hsl(var(--muted-foreground))",
        fontSize: "0.875rem", // Match text-sm
      }),
      noOptionsMessage: (provided) => ({
        ...provided,
        color: "hsl(var(--muted-foreground))",
        fontSize: "0.875rem", // Match text-sm
        backgroundColor: "hsl(var(--background))",
      }),
      loadingMessage: (provided) => ({
        ...provided,
        color: "hsl(var(--muted-foreground))",
        fontSize: "0.875rem", // Match text-sm
        backgroundColor: "hsl(var(--background))",
      }),
      valueContainer: (provided) => ({
        ...provided,
        padding: "2px 8px",
        fontSize: "0.875rem", // Match text-sm
      }),
    };

    const handleInputChange = (newValue) => {
      setInputValue(newValue);
    };

    const defaultLoadOptions = async (inputValue) => {
      if (inputValue.length < 1) return [];
      return options.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    };

    return (
      <AsyncCreatableSelect
        ref={ref}
        className={cn("w-full", className)}
        classNamePrefix="react-select"
        placeholder={placeholder}
        isClearable={isClearable}
        isMulti={isMulti}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        onCreateOption={onCreateOption}
        loadOptions={loadOptions || defaultLoadOptions}
        onInputChange={handleInputChange}
        inputValue={inputValue}
        styles={customStyles}
        formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: "hsl(var(--primary))",
            primary75: "hsl(var(--primary) / 0.75)",
            primary50: "hsl(var(--primary) / 0.5)",
            primary25: "hsl(var(--accent))",
            danger: "hsl(var(--destructive))",
            dangerLight: "hsl(var(--destructive) / 0.3)",
            neutral0: "hsl(var(--background))",
            neutral5: "hsl(var(--accent))",
            neutral10: "hsl(var(--accent))",
            neutral20: "hsl(var(--border))",
            neutral30: "hsl(var(--border))",
            neutral40: "hsl(var(--muted-foreground))",
            neutral50: "hsl(var(--muted-foreground))",
            neutral60: "hsl(var(--foreground))",
            neutral70: "hsl(var(--foreground))",
            neutral80: "hsl(var(--foreground))",
            neutral90: "hsl(var(--foreground))",
          },
          borderRadius: 4,
        })}
        components={{
          MultiValueRemove: ({ innerProps, children }) => (
            <div
              {...innerProps}
              className="flex items-center justify-center h-full w-6 hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
            >
              {children || "×"}
            </div>
          ),
        }}
        {...props}
      />
    );
  }
);

CreatableSelect.displayName = "CreatableSelect";

export { CreatableSelect };
