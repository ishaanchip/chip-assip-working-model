import { Portal, Select, createListCollection } from "@chakra-ui/react"
import { useEffect, useState } from "react"

export const Picker = ({selectionCategory, selectionOptions, setVariable}) => {

    const field = createListCollection({
        items: selectionOptions.map((option) =>{
            return {label:option[1], value:option[0]}
        })
    })



  
  return (
    <Select.Root   collection={field} size="sm" width="350px" mb="25px"   onValueChange={(selection) => {
        setVariable(selection)
    }}>
      <Select.HiddenSelect />
      <Select.Label>Select patient {selectionCategory}</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder={`Select ${selectionCategory}`} />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content maxHeight="425px">
            {field.items.map((option) => (
              <Select.Item item={option} key={option.value}>
                {option.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  )
}

