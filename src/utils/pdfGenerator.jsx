import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#1f2937'
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#1f2937'
  },
  card: {
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9fafb'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1f2937'
  },
  cardText: {
    fontSize: 12,
    color: '#4b5563'
  },
  text: {
    fontSize: 12,
    color: '#4b5563',
    marginBottom: 5
  },
  listItem: {
    fontSize: 12,
    color: '#4b5563',
    marginBottom: 5,
    marginLeft: 15
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 10
  }
});

// Create Document Component
const EmotionSummaryDocument = ({ cards, summaryReport, accumulated_text }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Your Emotion Reading Summary</Text>

      {/* Emotion Cards Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Emotion Cards</Text>
        {cards.map((card, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{card.emotion}</Text>
            <Text style={styles.cardText}>{card.definition}</Text>
          </View>
        ))}
      </View>

      {/* What You Shared */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What You Shared</Text>
        <Text style={styles.text}>{accumulated_text || 'No conversation content available.'}</Text>
      </View>

      {/* Overall Analysis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overall Analysis</Text>
        {summaryReport?.keyInsightsSummary ? (
          summaryReport.keyInsightsSummary.split('\n\n').map((section, index) => {
            if (section.startsWith('**') && section.endsWith('**')) {
              return (
                <Text key={index} style={[styles.text, { fontWeight: 'bold' }]}>
                  {section.replace(/\*\*/g, '')}
                </Text>
              );
            }
            return <Text key={index} style={styles.text}>{section}</Text>;
          })
        ) : (
          summaryReport?.overallAnalysis?.map((paragraph, index) => (
            <Text key={index} style={styles.text}>{paragraph}</Text>
          ))
        )}
      </View>

      {/* Key Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Insights</Text>
        {summaryReport?.keyInsights?.map((insight, index) => (
          <Text key={index} style={styles.listItem}>• {insight}</Text>
        ))}
      </View>

      {/* Moving Forward */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Moving Forward</Text>
        {summaryReport?.movingForward?.map((paragraph, index) => (
          <Text key={index} style={styles.text}>{paragraph}</Text>
        ))}
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Generated on {new Date().toLocaleDateString()}
      </Text>
    </Page>
  </Document>
);

export default EmotionSummaryDocument; 