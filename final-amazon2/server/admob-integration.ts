/**
 * Google AdMob Integration Module
 * Handles banner ads, interstitial ads, and rewarded video ads
 */

import { ENV } from "./_core/env";

export interface AdmobConfig {
  bannerAdUnitId?: string;
  interstitialAdUnitId?: string;
  rewardedAdUnitId?: string;
}

export interface AdRevenueData {
  adNetwork: string;
  adType: "banner" | "interstitial" | "rewarded";
  revenue: number;
  impressionCount: number;
}

/**
 * Initialize Google AdMob with user configuration
 */
export function initializeAdmob(config: AdmobConfig) {
  return {
    bannerAdUnitId: config.bannerAdUnitId || process.env.ADMOB_BANNER_AD_UNIT_ID,
    interstitialAdUnitId: config.interstitialAdUnitId || process.env.ADMOB_INTERSTITIAL_AD_UNIT_ID,
    rewardedAdUnitId: config.rewardedAdUnitId || process.env.ADMOB_REWARDED_AD_UNIT_ID,
    isInitialized: !!(
      config.bannerAdUnitId || 
      config.interstitialAdUnitId || 
      config.rewardedAdUnitId
    ),
  };
}

/**
 * Track ad impression and revenue
 */
export function trackAdImpression(data: AdRevenueData) {
  return {
    adNetwork: data.adNetwork,
    adType: data.adType,
    revenue: data.revenue,
    impressionCount: data.impressionCount,
    timestamp: new Date(),
    estimatedMonthlyRevenue: data.revenue * 30, // Rough estimate
  };
}

/**
 * Calculate estimated revenue from ads
 */
export function calculateEstimatedAdRevenue(
  dailyImpressions: number,
  cpmRate: number = 5 // $5 CPM (cost per thousand impressions) - typical for casino apps
): number {
  return (dailyImpressions / 1000) * cpmRate;
}

/**
 * Get recommended ad placement strategy for casino app
 */
export function getAdPlacementStrategy() {
  return {
    bannerAds: {
      placement: ["bottom_of_home", "between_games", "leaderboard_bottom"],
      frequency: "always_visible",
      refreshRate: 30000, // 30 seconds
      estimatedCPM: 3,
    },
    interstitialAds: {
      placement: ["after_game_loss", "after_3_games", "before_shop"],
      frequency: "every_3_games",
      estimatedCPM: 8,
    },
    rewardedAds: {
      placement: ["lucky_spins", "bonus_multiplier", "free_chips"],
      frequency: "user_initiated",
      rewardAmount: 50, // chips
      estimatedCPM: 15,
    },
  };
}

/**
 * Calculate potential monthly revenue from ads
 */
export function calculateMonthlyAdRevenue(
  dailyActiveUsers: number,
  impressionsPerUser: number = 20,
  cpmRate: number = 5
): number {
  const monthlyImpressions = dailyActiveUsers * impressionsPerUser * 30;
  return (monthlyImpressions / 1000) * cpmRate;
}

/**
 * Get ad revenue optimization tips
 */
export function getAdOptimizationTips() {
  return [
    "Place banner ads at the bottom of screens for better CTR",
    "Show interstitial ads after losing games (higher engagement)",
    "Use rewarded ads for bonus chips (higher CPM rates)",
    "Refresh banner ads every 30 seconds for more impressions",
    "Avoid showing ads during active gameplay",
    "Show ads between games, not during gameplay",
    "Use A/B testing to find optimal ad placement",
    "Monitor CPM rates and adjust placement accordingly",
  ];
}
