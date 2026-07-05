import { StockLowPayload } from '../payloads/stock-low.payload';
export declare class StockLowListener {
    handleStockLow(_payload: StockLowPayload): Promise<void>;
}
