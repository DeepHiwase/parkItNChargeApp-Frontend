import {
  FormControl,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from '@mui/material'
import { useState } from 'react'
import { useValue } from '../../../context/ContextProvider'
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import InfoField from './InfoField';

const AddDetails = () => {
  const {
    state: {
      details: { name, description, price },
    },
    dispatch,
  } = useValue()
  const [costType, setCostType] = useState(price ? 40 : 10)

  const handleCostTypeChange = (e) => {
    const costType = Number(e.target.value)
    setCostType(costType)
    if (costType === 10) {
      dispatch({ type: 'UPDATE_DETAILS', payload: { price: 10 } })
    } else {
      dispatch({ type: 'UPDATE_DETAILS', payload: { price: 40 } })
    }
  }

  const handlePriceChange = (e) => {
    dispatch({ type: 'UPDATE_DETAILS', payload: { price: e.target.value } })
  }
  return (
    <Stack
      sx={{
        alignItems: 'center',
        '& .MuiTextField-root': { width: '100%', maxWidth: 500, m: 1 },
      }}
    >
      <FormControl>
        <RadioGroup
          name='costType'
          value={costType}
          row
          onChange={handleCostTypeChange}
        >
          <FormControlLabel
            value={0}
            control={<Radio />}
            label='Cost-Efficient Charger'
          />
          <FormControlLabel
            value={1}
            control={<Radio />}
            label='Rapid Charger'
          />
          {Boolean(costType) && (
            <TextField
              sx={{ width: '7ch !important' }}
              variant='standard'
              slotProps={{
                htmlInput: { type: 'number', min: 1, max: 50 },
                startAdornment: (
                  <InputAdornment position='start'>$</InputAdornment>
                ),
              }}
              value={price}
              onChange={handlePriceChange}
              name='price'
            />
          )}
        </RadioGroup>
      </FormControl>
      <InfoField
        mainProps={{name: 'name', label: 'Name', value: name}}
        minLength={5}
      />
      <InfoField
        mainProps={{name: 'description', label: 'Description', value: description}}
        minLength={10}
        optionalProps={{
          multiline: true,
          rows: 4
        }}
      />
    </Stack>
  )
}

export default AddDetails
