import { View } from 'react-native'

// dead simple View component that spaces things around on a page.
const Spacer = ({ width = "100%", height = 40 }) => {
  return (
    <View style={{ width, height }} />
  )
}

export default Spacer