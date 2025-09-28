// src/components/BaseInfo.tsx
import { getBalance } from '@wagmi/core'
import { config } from './config'

const balance = getBalance(config, {
  address: '0xBbe4C705bdA4e355822b067665DD0c7e83458595',
})

// log the balance to the console (for demonstration purposes)
console.log('Account Balance:', balance)

export function BaseInfo() {
    return (
        <div>
            <h2>Account Balance</h2>
            <pre>{JSON.stringify(balance, null, 2)}</pre>
        </div>
    );
}
