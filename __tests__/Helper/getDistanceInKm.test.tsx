import { getDistanceInKm } from "../../src/Helper/getDistanceInKm"

describe('getDistanceInKm', () => {
  it('should return 0 for same coordinates', () => {
    const distance = getDistanceInKm(28.6139, 77.2090, 28.6139, 77.2090)

    expect(distance).toBe(0)
  })

  it('should calculate correct distance between two locations', () => {
    // Delhi → Noida (approx 13–15 km)
    const distance = getDistanceInKm(28.6139, 77.2090, 28.5355, 77.3910)

    expect(distance).toBeGreaterThan(10)
    expect(distance).toBeLessThan(20)
  })

  it('should return same distance regardless of point order', () => {
    const d1 = getDistanceInKm(28.6139, 77.2090, 19.0760, 72.8777) // Delhi → Mumbai
    const d2 = getDistanceInKm(19.0760, 72.8777, 28.6139, 77.2090) // Mumbai → Delhi

    expect(d1).toBe(d2)
  })

  it('should return value rounded to 2 decimal places', () => {
    const distance = getDistanceInKm(28.6139, 77.2090, 19.0760, 72.8777)

    // check 2 decimal precision
    expect(distance.toString().split('.')[1]?.length).toBeLessThanOrEqual(2)
  })
})
