import { Input, Select } from "antd";
import { useMemo } from "react";
import { countryCallingCodes } from "@utils/countryCallingCodes";

const countryCodeOptions = countryCallingCodes.map(({ country, code, iso }) => ({
  label: `${iso} ${code}`,
  value: code,
  title: country,
}));

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

function splitPhoneValue(value?: string) {
  const matchingCode = countryCodeOptions.find((countryCode) => value?.startsWith(countryCode.value));

  if (!matchingCode) {
    return {
      countryCode: "+973",
      phoneNumber: value?.replace(/^\+/, "") ?? "",
    };
  }

  return {
    countryCode: matchingCode.value,
    phoneNumber: value?.slice(matchingCode.value.length) ?? "",
  };
}

export function PhoneInput({ value, onChange, placeholder = "12345678" }: PhoneInputProps) {
  const { countryCode, phoneNumber } = useMemo(() => splitPhoneValue(value), [value]);

  const updateValue = (nextCountryCode: string, nextPhoneNumber: string) => {
    onChange?.(`${nextCountryCode}${nextPhoneNumber.replace(/\D/g, "")}`);
  };

  return (
    <Input
      addonBefore={
        <Select
          value={countryCode}
          options={countryCodeOptions}
          showSearch
          optionFilterProp="title"
          popupMatchSelectWidth={false}
          onChange={(nextCountryCode) => updateValue(nextCountryCode, phoneNumber)}
          style={{ width: 116 }}
        />
      }
      value={phoneNumber}
      inputMode="numeric"
      placeholder={placeholder}
      autoComplete="tel-national"
      onChange={(event) => updateValue(countryCode, event.target.value)}
    />
  );
}
