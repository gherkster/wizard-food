import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectProps = {
  label: string;
  options: SelectOption[];
  value?: string;
  disabled?: boolean;
  onChange: (value: string | undefined) => void;
};

export const Select = (props: Readonly<SelectProps>) => {
  const selected = props.options.find((option) => option.value === props.value);
  const buttonLabel = selected?.label ?? props.label;

  return (
    <Listbox
      value={props.value ?? ""}
      disabled={props.disabled}
      onChange={(nextValue) => {
        const next = typeof nextValue === "string" && nextValue.length > 0 ? nextValue : undefined;
        props.onChange(next);
      }}
    >
      <div className="relative inline-flex min-w-[170px]">
        <ListboxButton
          className="inline-flex w-full items-center justify-between rounded-full border border-[color:var(--color-border)]/45 bg-[color:var(--color-surface)] px-4 py-2 text-left text-sm font-medium hover:border-[color:var(--color-primary)]/45 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-[color:var(--color-border)]/45"
          aria-label={props.label}
        >
          <span className="truncate">{buttonLabel}</span>
          <span className="ml-2 text-xs">▾</span>
        </ListboxButton>
        <ListboxOptions
          anchor="bottom start"
          portal
          modal={false}
          className="z-50 mt-2 max-h-72 w-[220px] overflow-auto rounded-md border border-black/10 bg-[color:var(--color-surface)] p-2 shadow-lg outline-none"
        >
          <ListboxOption
            value=""
            className="mb-1 cursor-pointer rounded-md px-2 py-1.5 text-sm data-[focus]:bg-[color:var(--color-surface-soft)]"
          >
            Any {props.label}
          </ListboxOption>
          {props.options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className="mb-1 cursor-pointer rounded-md px-2 py-1.5 text-sm data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45 data-[focus]:bg-[color:var(--color-surface-soft)]"
            >
              {option.label}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
};
