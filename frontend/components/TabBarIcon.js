import { Ionicons } from '@expo/vector-icons';

export default function TabBarIcon(props) {
    return (
        <Ionicons 
            name={props.name}
            size={30}
            style={{ marginBottom: -3 }}
            color={props.focused ? '#2f95dc' : '#ccc' }
        />
    )
}