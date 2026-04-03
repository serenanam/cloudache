import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface GaugeWidgetProps {
  current: number;
  low: number;
  high: number;
  unit?: string;
  trend?: TrendDirection;
  size?: number;
  tintColor?: string;
  mutedColor?: string;
  style?: ViewStyle;
  decimals?: number; // how many decimal places to show, defaults to 0
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
): string {
  let end = endDeg;
  while (end < startDeg) end += 360;
  const sweep = end - startDeg;
  const largeArc = sweep > 180 ? 1 : 0;
  const start = polarToCartesian(cx, cy, r, startDeg);
  const endPt = polarToCartesian(cx, cy, r, end);
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${endPt.x} ${endPt.y}`;
}

const ARC_START = 230;
const ARC_SPAN = 260;
const ARC_END = (ARC_START + ARC_SPAN) % 360;

function valueToDeg(value: number, low: number, high: number): number {
  const t = high === low
    ? 0.5
    : Math.max(0, Math.min(1, (value - low) / (high - low)));
  return ARC_START + t * ARC_SPAN;
}

// ─── Trend Indicator ──────────────────────────────────────────────────────────

interface TrendBadgeProps {
  direction: TrendDirection;
  color: string;
  mutedColor: string;
}

const TrendBadge: React.FC<TrendBadgeProps> = ({ direction, color, mutedColor }) => {
  if (direction === 'neutral') return null;

  const isUp = direction === 'up';
  const chevron = isUp
    ? 'M4 9 L8 5 L12 9'
    : 'M4 5 L8 9 L12 5';

  return (
    <View style={trendStyles.badge}>
      <Svg width={12} height={14} viewBox="0 0 16 14">
        <Path
          d={chevron}
          stroke={color}
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </View>
  );
};

const trendStyles = StyleSheet.create({
  badge: {
    marginLeft: 3,
    marginBottom: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// ─── GaugeWidget ─────────────────────────────────────────────────────────────

const GaugeWidget: React.FC<GaugeWidgetProps> = ({
  current,
  low,
  high,
  unit = '°',
  trend = 'neutral',
  size = 120,
  tintColor = 'rgba(255,255,255,0.9)',
  mutedColor = 'rgba(255,255,255,0.5)',
  decimals = 0,  // default to whole numbers
  style,
}) => {
  const STROKE = 2.5;
  const DOT_R = 4;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - STROKE - DOT_R - 2;

  const animAngle = useRef(new Animated.Value(ARC_START)).current;
  const targetDeg = valueToDeg(current, low, high);

  useEffect(() => {
    animAngle.setValue(ARC_START);
    Animated.timing(animAngle, {
      toValue: targetDeg,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [targetDeg]);

  const dot = polarToCartesian(cx, cy, r, targetDeg);
  const activeArc = arcPath(cx, cy, r, ARC_START, targetDeg);
  const fullArc = arcPath(cx, cy, r, ARC_START, ARC_END);

  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        {/* Track */}
        <Path
          d={fullArc}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />
        {/* Active fill */}
        <Path
          d={activeArc}
          fill="none"
          stroke={tintColor}
          strokeWidth={STROKE}
          strokeLinecap="round"
          opacity={0.7}
        />
        {/* Glow halo */}
        <Circle cx={dot.x} cy={dot.y} r={DOT_R + 3} fill="rgba(255,255,255,0.1)" />
        {/* Dot */}
        <Circle cx={dot.x} cy={dot.y} r={DOT_R} fill={tintColor} />
      </Svg>

      {/* Centre text */}
      <View style={styles.center}>
        <TrendBadge direction={trend} color={tintColor} mutedColor={mutedColor} />
        <View style={styles.currentRow}>
          <Text style={[styles.currentValue, { color: tintColor }]}>
            {current.toFixed(decimals)}
          </Text>
        </View>
        <Text style={[styles.unitLabel, { color: mutedColor }]}>
          {unit}
        </Text>
        <View style={styles.rangeRow}>
          <Text style={[styles.rangeLabel, { color: mutedColor }]}>
            {low.toFixed(decimals)}
          </Text>
          <Text style={[styles.rangeLabel, { color: mutedColor }]}>
            {high.toFixed(decimals)}
          </Text>
        </View>
      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  currentValue: {
    fontFamily: 'Raleway_300Light',
    fontSize: 24,
    letterSpacing: -0.5,
    includeFontPadding: false,
  },
  currentValueUnit: {
    fontSize: 12,
  },
  rangeRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 2,
  },
  rangeLabel: {
    fontFamily: 'Raleway_400Regular',
    fontSize: 11,
    letterSpacing: 0.3,
  },
  unitLabel: {
    fontFamily: 'Raleway_400Regular',
    fontSize: 11,
    letterSpacing: 0.3,
    marginBottom: 2,
  },
});

export default GaugeWidget;