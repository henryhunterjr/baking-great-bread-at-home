
import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"

type Option = {
  label: string
  value: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  disabled?: boolean
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  disabled = false,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const handleUnselect = React.useCallback((option: string) => {
    onChange(selected.filter((s) => s !== option))
  }, [onChange, selected])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "" && selected.length > 0) {
          handleUnselect(selected[selected.length - 1])
        }
      }
      // This is not a default behavior of the <input /> field
      if (e.key === "Escape") {
        input.blur()
        setOpen(false)
      }
    }
  }, [handleUnselect, selected])

  const selectables = options.filter((option) => !selected.includes(option.value))

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div
        className={`group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        }`}
        onClick={() => {
          if (!disabled) {
            inputRef.current?.focus()
          }
        }}
      >
        <div className="flex flex-wrap gap-1">
          {selected.map((option) => (
            <Badge key={option} variant="secondary" className="mr-1 mb-1">
              {options.find(o => o.value === option)?.label || option}
              {!disabled && (
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleUnselect(option)
                  }}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </Badge>
          ))}
          
          {!disabled && (
            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              placeholder={selected.length === 0 ? placeholder : undefined}
              className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
              disabled={disabled}
            />
          )}
        </div>
      </div>
      
      <div className="relative">
        {open && selectables.length > 0 && (
          <div className="absolute top-2 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto max-h-52">
              {selectables.map((option) => (
                <CommandItem
                  key={option.value}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onSelect={() => {
                    setInputValue("")
                    onChange([...selected, option.value])
                  }}
                  className="cursor-pointer"
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        )}
      </div>
    </Command>
  )
}
